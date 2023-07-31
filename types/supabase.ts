export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      test: {
        Row: {
          company: string | null
          created_at: string | null
          down: number | null
          hh_size: number | null
          id: string
          lat: number | null
          latency: number | null
          long: number | null
          num_comp: number | null
          region: string | null
          street_address: string | null
          up: number | null
          zip: number | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          down?: number | null
          hh_size?: number | null
          id?: string
          lat?: number | null
          latency?: number | null
          long?: number | null
          num_comp?: number | null
          region?: string | null
          street_address?: string | null
          up?: number | null
          zip?: number | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          down?: number | null
          hh_size?: number | null
          id?: string
          lat?: number | null
          latency?: number | null
          long?: number | null
          num_comp?: number | null
          region?: string | null
          street_address?: string | null
          up?: number | null
          zip?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      data1: {
        Row: {
          company: string | null
          down: number | null
          hh_size: number | null
          id: string | null
          latency: number | null
          num_comp: number | null
          region: string | null
          up: number | null
          zip: number | null
        }
        Insert: {
          company?: string | null
          down?: number | null
          hh_size?: number | null
          id?: string | null
          latency?: number | null
          num_comp?: number | null
          region?: string | null
          up?: number | null
          zip?: number | null
        }
        Update: {
          company?: string | null
          down?: number | null
          hh_size?: number | null
          id?: string | null
          latency?: number | null
          num_comp?: number | null
          region?: string | null
          up?: number | null
          zip?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
