'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface AdminAuthState {
  isAdmin: boolean
  isEditor: boolean
  loading: boolean
  permissions: {
    can_posts: boolean
    can_categories: boolean
    can_reviews: boolean
    can_orders: boolean
    can_products: boolean
  }
}

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAdmin: false,
    isEditor: false,
    loading: true,
    permissions: {
      can_posts: false,
      can_categories: false,
      can_reviews: false,
      can_orders: false,
      can_products: false
    }
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setAuthState(prev => ({ ...prev, loading: false }))
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const role = profile?.role || 'user'
        const permissionsData = {
          can_posts: false,
          can_categories: false,
          can_reviews: false,
          can_orders: false,
          can_products: false,
        }

        try {
          const { data: permissions } = await supabase
            .from('admin_permissions')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()

          if (permissions) {
            permissionsData.can_posts = !!permissions.can_posts
            permissionsData.can_categories = !!permissions.can_categories
            permissionsData.can_reviews = !!permissions.can_reviews
            permissionsData.can_orders = !!permissions.can_orders
            permissionsData.can_products = !!permissions.can_products
          }
        } catch (permissionsError) {
          console.error('Erro ao carregar permissões:', permissionsError)
        }
        
        setAuthState({
          isAdmin: role === 'admin',
          isEditor: role === 'editor' || role === 'admin',
          loading: false,
          permissions: permissionsData
        })
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth()
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    isAdmin: authState.isAdmin,
    isEditor: authState.isEditor,
    loading: authState.loading,
    canPosts: authState.permissions.can_posts,
    canCategories: authState.permissions.can_categories,
    canReviews: authState.permissions.can_reviews,
    canOrders: authState.permissions.can_orders,
    canProducts: authState.permissions.can_products,
    permissions: authState.permissions
  }
}
