// 数据服务 - 从后端API获取数据
import { FieldDetailData, CaseDetailData, SpiritCategory } from '../types';

const API_BASE = '/api';

// 知识库数据
export const fetchAllKnowledge = async (): Promise<Record<string, FieldDetailData>> => {
  const response = await fetch(`${API_BASE}/knowledge`);
  if (!response.ok) {
    throw new Error(`Failed to fetch knowledge: ${response.statusText}`);
  }
  const data = await response.json();
  
  // 转换数组为对象格式（以id为key）
  const result: Record<string, FieldDetailData> = {};
  data.forEach((item: any) => {
    result[item.id] = {
      id: item.id,
      name: item.name,
      icon: item.icon,
      overview: item.overview,
      ideologicalPoint: item.ideological_point,
      history: item.history,
      future: item.future
    };
  });
  return result;
};

export const fetchKnowledgeById = async (id: string): Promise<FieldDetailData | null> => {
  const response = await fetch(`${API_BASE}/knowledge/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch knowledge: ${response.statusText}`);
  }
  const item = await response.json();
  return {
    id: item.id,
    name: item.name,
    icon: item.icon,
    overview: item.overview,
    ideologicalPoint: item.ideological_point,
    history: item.history,
    future: item.future
  };
};

// 案例数据
export const fetchAllCases = async (): Promise<Record<string, CaseDetailData>> => {
  const response = await fetch(`${API_BASE}/cases`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cases: ${response.statusText}`);
  }
  const data = await response.json();
  
  // 转换数组为对象格式（以id为key）
  const result: Record<string, CaseDetailData> = {};
  data.forEach((item: any) => {
    result[item.id] = {
      id: item.id,
      title: item.title,
      category: item.category,
      summary: item.summary,
      tags: item.tags || [],
      quote: item.quote,
      images: item.images || [],
      relatedTech: item.relatedTech || [],
      sourceUrl: item.source_url,
      fullContent: item.full_content
    };
  });
  return result;
};

export const fetchCaseById = async (id: string): Promise<CaseDetailData | null> => {
  const response = await fetch(`${API_BASE}/cases/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch case: ${response.statusText}`);
  }
  const item = await response.json();
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    summary: item.summary,
    tags: item.tags || [],
    quote: item.quote,
    images: item.images || [],
    relatedTech: item.relatedTech || [],
    sourceUrl: item.source_url,
    fullContent: item.full_content
  };
};

export const fetchCasesByCategory = async (category: 'red_engineering' | 'model_engineer'): Promise<CaseDetailData[]> => {
  const response = await fetch(`${API_BASE}/cases?category=${category}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cases: ${response.statusText}`);
  }
  const data = await response.json();
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    summary: item.summary,
    tags: item.tags || [],
    quote: item.quote,
    images: item.images || [],
    relatedTech: item.relatedTech || [],
    sourceUrl: item.source_url,
    fullContent: item.full_content
  }));
};

// 精神谱系数据
export const fetchSpirits = async (): Promise<SpiritCategory[]> => {
  const response = await fetch(`${API_BASE}/spirits`);
  if (!response.ok) {
    throw new Error(`Failed to fetch spirits: ${response.statusText}`);
  }
  return await response.json();
};
