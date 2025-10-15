'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Calendar, Clock, User, ArrowLeft, MessageCircle, Send } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'
import { formatDate } from '@/lib/utils'

interface Comment {
  id: number
  author: string
  date: string
  content: string
  replies?: Comment[]
}

export default function BlogPostPage() {
  const params = useParams()
  const post = blogPosts.find(p => p.slug === params.slug)
  
  const [comments, setComments] = useState<Comment[]>([])

  const [newComment, setNewComment] = useState({ author: '', content: '' })
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
          <Link href="/blog" className="text-primary-600 hover:text-primary-700">
            Voltar para o blog
          </Link>
        </div>
      </div>
    )
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.author && newComment.content) {
      const comment: Comment = {
        id: comments.length + 1,
        author: newComment.author,
        date: new Date().toISOString().split('T')[0],
        content: newComment.content,
      }
      setComments([...comments, comment])
      setNewComment({ author: '', content: '' })
    }
  }

  const handleReplySubmit = (commentId: number) => {
    if (replyContent) {
      const reply: Comment = {
        id: Date.now(),
        author: 'Você',
        date: new Date().toISOString().split('T')[0],
        content: replyContent,
      }
      
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          }
        }
        return comment
      }))
      
      setReplyContent('')
      setReplyTo(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-gray-200 hover:text-white mb-6"
          >
            <ArrowLeft size={20} />
            <span>Voltar para o blog</span>
          </Link>
          
          <div className="max-w-4xl">
            <span className="inline-block bg-gold-500 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-200">
              <div className="flex items-center space-x-2">
                <User size={20} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>{formatDate(new Date(post.date))}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={20} />
                <span>{post.readTime} de leitura</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Article Content */}
            <article className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-12">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  lineHeight: '1.8',
                }}
              />
            </article>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-2">
                <MessageCircle size={32} />
                <span>Comentários ({comments.length})</span>
              </h2>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Deixe seu comentário
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={newComment.author}
                      onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Seu comentário ou pergunta..."
                      value={newComment.content}
                      onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gold-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors flex items-center space-x-2"
                  >
                    <span>Enviar Comentário</span>
                    <Send size={20} />
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                        <User className="text-primary-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">{comment.author}</h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(new Date(comment.date))}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{comment.content}</p>
                        <button
                          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          className="text-primary-600 text-sm font-medium hover:text-primary-700"
                        >
                          Responder
                        </button>

                        {/* Reply Form */}
                        {replyTo === comment.id && (
                          <div className="mt-4 ml-8">
                            <textarea
                              placeholder="Sua resposta..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none mb-2"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleReplySubmit(comment.id)}
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                              >
                                Enviar
                              </button>
                              <button
                                onClick={() => {
                                  setReplyTo(null)
                                  setReplyContent('')
                                }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-8 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3">
                                <div className="bg-gold-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                                  <User className="text-gold-600" size={20} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h5 className="font-semibold text-gray-900 text-sm">
                                      {reply.author}
                                    </h5>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(new Date(reply.date))}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
