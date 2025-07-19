import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { 
  ApiResponse, 
  Journal, 
  Todo, 
  Category, 
  Profile, 
  Settings,
  Anniversary,
  JournalFormData,
  TodoFormData,
  ProfileFormData,
  SettingsFormData
} from '@/types'
import { 
  sampleJournals, 
  sampleTodos, 
  sampleCategories, 
  sampleProfile, 
  sampleSettings, 
  sampleImages, 
  sampleAnniversaries, 
  sampleStats 
} from '@/data/sampleData'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(password: string): Promise<ApiResponse<{ token: string }>> {
    console.log('login password:', password);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { token: 'sample-token-123' },
      message: '로그인 성공'
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    console.log('changePassword oldPassword:', oldPassword, 'newPassword:', newPassword);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: undefined,
      message: '비밀번호 변경 성공'
    }
  }

  // Journal endpoints
  async getJournals(date?: string): Promise<ApiResponse<Journal[]>> {
    console.log('getJournals date:', date);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: sampleJournals,
      message: '일기 목록 조회 성공'
    }
  }

  async getJournal(id: string): Promise<ApiResponse<Journal>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    const journal = sampleJournals.find(j => j.id === id)
    return {
      success: true,
      data: journal!,
      message: '일기 조회 성공'
    }
  }

  async createJournal(data: JournalFormData): Promise<ApiResponse<Journal>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const newJournal: Journal = {
      id: String(Date.now()),
      date: data.date,
      weather: data.weather,
      weatherComment: data.weatherComment,
      feeling: data.feeling,
      feelingComment: data.feelingComment,
      contents: data.contents,
      saved: true,
      locked: data.locked || false,
      registeredOn: Date.now(),
      modifiedOn: Date.now()
    }
    return {
      success: true,
      data: newJournal,
      message: '일기 생성 성공'
    }
  }

  async updateJournal(id: string, data: Partial<JournalFormData>): Promise<ApiResponse<Journal>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const journal = sampleJournals.find(j => j.id === id)
    const updatedJournal = { ...journal, ...data, modifiedOn: Date.now() }
    return {
      success: true,
      data: updatedJournal as Journal,
      message: '일기 수정 성공'
    }
  }

  async deleteJournal(id: string): Promise<ApiResponse<void>> {
    console.log('deleteJournal id:', id);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: undefined,
      message: '일기 삭제 성공'
    }
  }

  async saveJournalDraft(id: string): Promise<ApiResponse<Journal>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    const journal = sampleJournals.find(j => j.id === id)
    return {
      success: true,
      data: journal!,
      message: '일기 저장 성공'
    }
  }

  // Todo endpoints
  async getTodos(date?: string): Promise<ApiResponse<Todo[]>> {
    console.log('getTodos date:', date);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: sampleTodos,
      message: '할일 목록 조회 성공'
    }
  }

  async getTodo(id: string): Promise<ApiResponse<Todo>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    const todo = sampleTodos.find(t => t.id === id)
    return {
      success: true,
      data: todo!,
      message: '할일 조회 성공'
    }
  }

  async createTodo(data: TodoFormData): Promise<ApiResponse<Todo>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const newTodo: Todo = {
      id: String(Date.now()),
      categoryId: data.categoryId,
      contents: data.contents,
      memo: data.memo,
      isPeriod: data.isPeriod,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      status: data.status,
      registeredOn: Date.now()
    }
    return {
      success: true,
      data: newTodo,
      message: '할일 생성 성공'
    }
  }

  async updateTodo(id: string, data: Partial<TodoFormData>): Promise<ApiResponse<Todo>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const todo = sampleTodos.find(t => t.id === id)
    const updatedTodo = { ...todo, ...data }
    return {
      success: true,
      data: updatedTodo as Todo,
      message: '할일 수정 성공'
    }
  }

  async deleteTodo(id: string): Promise<ApiResponse<void>> {
    console.log('deleteTodo id:', id);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: undefined,
      message: '할일 삭제 성공'
    }
  }

  async copyTodo(id: string, newDate: string): Promise<ApiResponse<Todo>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const todo = sampleTodos.find(t => t.id === id)
    const copiedTodo = { ...todo, id: String(Date.now()), startDateTime: newDate, endDateTime: newDate }
    return {
      success: true,
      data: copiedTodo as Todo,
      message: '할일 복사 성공'
    }
  }

  // Category endpoints
  async getCategories(): Promise<ApiResponse<Category[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: sampleCategories,
      message: '카테고리 목록 조회 성공'
    }
  }

  async createCategory(name: string, color: string): Promise<ApiResponse<Category>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const newCategory: Category = {
      id: String(Date.now()),
      name,
      color,
      removed: false
    }
    return {
      success: true,
      data: newCategory,
      message: '카테고리 생성 성공'
    }
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<ApiResponse<Category>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const category = sampleCategories.find(c => c.id === id)
    const updatedCategory = { ...category, ...data }
    return {
      success: true,
      data: updatedCategory as Category,
      message: '카테고리 수정 성공'
    }
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    console.log('deleteCategory id:', id);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: undefined,
      message: '카테고리 삭제 성공'
    }
  }

  // Profile endpoints
  async getProfile(): Promise<ApiResponse<Profile>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: sampleProfile,
      message: '프로필 조회 성공'
    }
  }

  async updateProfile(data: ProfileFormData): Promise<ApiResponse<Profile>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const updatedProfile = { ...sampleProfile, ...data }
    return {
      success: true,
      data: updatedProfile,
      message: '프로필 수정 성공'
    }
  }

  // Settings endpoints
  async getSettings(): Promise<ApiResponse<Settings>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: sampleSettings,
      message: '설정 조회 성공'
    }
  }

  async updateSettings(data: Partial<SettingsFormData>): Promise<ApiResponse<Settings>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const updatedSettings = { ...sampleSettings, ...data }
    return {
      success: true,
      data: updatedSettings,
      message: '설정 수정 성공'
    }
  }

  // Stats endpoints
  async getFeelingStats(strategy: string, period: string): Promise<ApiResponse<any[]>> {
    console.log('getFeelingStats strategy:', strategy, 'period:', period);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: sampleStats.feelingStats,
      message: '감정 통계 조회 성공'
    }
  }

  async getTodoStats(strategy: string, period: string): Promise<ApiResponse<any[]>> {
    console.log('getTodoStats strategy:', strategy, 'period:', period);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: sampleStats.todoStats,
      message: '할일 통계 조회 성공'
    }
  }

  // Gallery endpoints
  async getGalleryImages(): Promise<ApiResponse<any[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: sampleImages,
      message: '갤러리 이미지 조회 성공'
    }
  }

  // Image endpoints
  async uploadImage(file: File, forJournal: boolean = true): Promise<ApiResponse<{ id: string, url: string }>> {
    console.log('uploadImage file:', file, 'forJournal:', forJournal);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { 
        id: String(Date.now()), 
        url: 'https://via.placeholder.com/300x200/3182CE/FFFFFF?text=Uploaded' 
      },
      message: '이미지 업로드 성공'
    }
  }

  async deleteImage(id: string): Promise<ApiResponse<void>> {
    console.log('deleteImage id:', id);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: undefined,
      message: '이미지 삭제 성공'
    }
  }

  // Anniversary endpoints
  async getAnniversaries(): Promise<ApiResponse<Anniversary[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: sampleAnniversaries,
      message: '기념일 목록 조회 성공'
    }
  }

  async createAnniversary(data: any): Promise<ApiResponse<Anniversary>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const newAnniversary: Anniversary = {
      id: String(Date.now()),
      type: data.type,
      date: data.date,
      name: data.name,
      weight: data.weight,
      registeredOn: Date.now(),
      modifiedOn: Date.now()
    }
    return {
      success: true,
      data: newAnniversary,
      message: '기념일 생성 성공'
    }
  }

  async updateAnniversary(id: string, data: any): Promise<ApiResponse<Anniversary>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const anniversary = sampleAnniversaries.find(a => a.id === id)
    const updatedAnniversary = { ...anniversary, ...data, modifiedOn: Date.now() }
    return {
      success: true,
      data: updatedAnniversary as Anniversary,
      message: '기념일 수정 성공'
    }
  }

  async deleteAnniversary(id: string): Promise<ApiResponse<void>> {
    console.log('deleteAnniversary id:', id);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: undefined,
      message: '기념일 삭제 성공'
    }
  }

  // Generic HTTP methods for direct API calls
  async get(url: string, config?: any): Promise<any> {
    const response = await this.api.get(url, config)
    return response.data
  }

  async post(url: string, data?: any, config?: any): Promise<any> {
    const response = await this.api.post(url, data, config)
    return response.data
  }

  async put(url: string, data?: any, config?: any): Promise<any> {
    const response = await this.api.put(url, data, config)
    return response.data
  }

  async delete(url: string, config?: any): Promise<any> {
    const response = await this.api.delete(url, config)
    return response.data
  }

  async patch(url: string, data?: any, config?: any): Promise<any> {
    const response = await this.api.patch(url, data, config)
    return response.data
  }
}

const api = new ApiService()
export default api 