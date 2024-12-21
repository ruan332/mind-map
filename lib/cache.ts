import { createClient } from '@vercel/kv'
import crypto from 'crypto'

// Cliente KV para cache
const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
})

// Função para gerar hash do arquivo PDF
export const generateFileHash = (fileContent: Buffer): string => {
  return crypto.createHash('sha256').update(fileContent).digest('hex')
}

// Interface para o cache de resposta
interface CacheResponse {
  data: any
  timestamp: number
}

// Cache para respostas da AI
export const cacheManager = {
  // Tempo de expiração do cache (24 horas)
  CACHE_EXPIRY: 24 * 60 * 60 * 1000,

  // Salvar resposta no cache
  async set(key: string, data: any): Promise<void> {
    const cacheData: CacheResponse = {
      data,
      timestamp: Date.now(),
    }
    await kv.set(key, JSON.stringify(cacheData))
  },

  // Buscar resposta do cache
  async get(key: string): Promise<any | null> {
    const cached = await kv.get(key)
    if (!cached) return null

    const cacheData: CacheResponse = JSON.parse(cached as string)
    
    // Verificar se o cache expirou
    if (Date.now() - cacheData.timestamp > this.CACHE_EXPIRY) {
      await kv.del(key)
      return null
    }

    return cacheData.data
  },

  // Verificar se existe cache válido
  async has(key: string): Promise<boolean> {
    const result = await this.get(key)
    return result !== null
  },
}
