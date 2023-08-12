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
      results: {
        Row: {
          down_avg: number | null
          id: number
          latency_avg: number | null
          served: number | null
          underserved: number | null
          unserved: number | null
          up_avg: number | null
        }
        Insert: {
          down_avg?: number | null
          id?: number
          latency_avg?: number | null
          served?: number | null
          underserved?: number | null
          unserved?: number | null
          up_avg?: number | null
        }
        Update: {
          down_avg?: number | null
          id?: number
          latency_avg?: number | null
          served?: number | null
          underserved?: number | null
          unserved?: number | null
          up_avg?: number | null
        }
        Relationships: []
      }
      speedtest: {
        Row: {
          download: number | null
          id: number
          latency: number | null
          latitude: number | null
          longitude: number | null
          rtc: Json | null
          timestamp: string | null
          upload: number | null
        }
        Insert: {
          download?: number | null
          id?: number
          latency?: number | null
          latitude?: number | null
          longitude?: number | null
          rtc?: Json | null
          timestamp?: string | null
          upload?: number | null
        }
        Update: {
          download?: number | null
          id?: number
          latency?: number | null
          latitude?: number | null
          longitude?: number | null
          rtc?: Json | null
          timestamp?: string | null
          upload?: number | null
        }
        Relationships: []
      }
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
      zip_converter: {
        Row: {
          zipcode: number
          ziplat: number | null
          ziplong: number
        }
        Insert: {
          zipcode?: number
          ziplat?: number | null
          ziplong: number
        }
        Update: {
          zipcode?: number
          ziplat?: number | null
          ziplong?: number
        }
        Relationships: []
      }
    }
    Views: {
      data: {
        Row: {
          company: string | null
          down: number | null
          hh_size: number | null
          latency: number | null
          num_comp: number | null
          region: string | null
          score: string | null
          up: number | null
          zip: number | null
        }
        Insert: {
          company?: string | null
          down?: number | null
          hh_size?: number | null
          latency?: number | null
          num_comp?: number | null
          region?: string | null
          score?: never
          up?: number | null
          zip?: number | null
        }
        Update: {
          company?: string | null
          down?: number | null
          hh_size?: number | null
          latency?: number | null
          num_comp?: number | null
          region?: string | null
          score?: never
          up?: number | null
          zip?: number | null
        }
        Relationships: []
      }
      data1: {
        Row: {
          company: string | null
          down: number | null
          hh_size: number | null
          id: string | null
          latency: number | null
          num_comp: number | null
          region: string | null
          score: string | null
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
          score?: never
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
          score?: never
          up?: number | null
          zip?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      selector: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
