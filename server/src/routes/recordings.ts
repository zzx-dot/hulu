import express from 'express';
import multer from 'multer';
import { S3Storage } from 'coze-coding-dev-sdk';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = express.Router();

// 初始化对象存储
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: '',
  secretKey: '',
  bucketName: process.env.COZE_BUCKET_NAME,
  region: 'cn-beijing',
});

// 配置 multer 用于接收文件
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB 限制
  },
});

/**
 * POST /api/v1/recordings
 * 上传录音文件并创建记录
 * Body: multipart/form-data
 *   - file: 录音文件
 *   - duration: 录音时长（秒）
 *   - snoreCount: 疑似打鼾次数
 *   - avgDecibel: 平均分贝
 *   - maxDecibel: 最大分贝
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未找到文件' });
    }

    const { duration, snoreCount, avgDecibel, maxDecibel } = req.body;

    // 上传文件到对象存储
    const fileKey = await storage.uploadFile({
      fileContent: req.file.buffer,
      fileName: `recordings/${Date.now()}.m4a`,
      contentType: req.file.mimetype,
    });

    // 保存记录到数据库
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('recordings')
      .insert({
        recording_date: new Date().toISOString(),
        duration_seconds: parseInt(duration) || 0,
        file_key: fileKey,
        file_size: req.file.size,
        snore_count: parseInt(snoreCount) || 0,
        avg_decibel: parseInt(avgDecibel) || -50,
        max_decibel: parseInt(maxDecibel) || -40,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`数据库插入失败: ${error.message}`);
    }

    res.status(201).json(data);
  } catch (error: any) {
    console.error('上传录音失败:', error);
    res.status(500).json({ error: error.message || '上传失败' });
  }
});

/**
 * GET /api/v1/recordings
 * 获取录音列表
 * Query: limit (可选，默认20)
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('recordings')
      .select('*')
      .order('recording_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`查询失败: ${error.message}`);
    }

    res.json(data || []);
  } catch (error: any) {
    console.error('获取录音列表失败:', error);
    res.status(500).json({ error: error.message || '查询失败' });
  }
});

/**
 * GET /api/v1/recordings/:id
 * 获取单个录音详情
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('recordings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`查询失败: ${error.message}`);
    }

    if (!data) {
      return res.status(404).json({ error: '录音不存在' });
    }

    // 生成签名 URL
    const audioUrl = await storage.generatePresignedUrl({
      key: data.file_key,
      expireTime: 86400, // 24小时
    });

    res.json({ ...data, audioUrl });
  } catch (error: any) {
    console.error('获取录音详情失败:', error);
    res.status(500).json({ error: error.message || '查询失败' });
  }
});

/**
 * DELETE /api/v1/recordings/:id
 * 删除录音
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const client = getSupabaseClient();

    // 先查询录音信息
    const { data: recording, error: fetchError } = await client
      .from('recordings')
      .select('file_key')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      throw new Error(`查询失败: ${fetchError.message}`);
    }

    if (!recording) {
      return res.status(404).json({ error: '录音不存在' });
    }

    // 删除对象存储中的文件
    await storage.deleteFile({ fileKey: recording.file_key });

    // 删除数据库记录
    const { error: deleteError } = await client
      .from('recordings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw new Error(`删除失败: ${deleteError.message}`);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('删除录音失败:', error);
    res.status(500).json({ error: error.message || '删除失败' });
  }
});

export default router;
