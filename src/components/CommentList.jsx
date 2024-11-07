import React from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/card';

const CommentList = ({ comments }) => {
  // 過濾非匿名留言並按時間排序
  const sortedComments = comments
    .filter(comment => comment.name) // 只保留非匿名留言
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // 時間排序

  return (
    <section className="h-screen w-full flex flex-col items-center bg-gradient-to-b from-blue-50 to-white snap-start relative overflow-hidden p-4">
      <div className="w-full max-w-4xl flex flex-col h-full z-10">
        <Card className="flex-grow overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">留言列表</h2>
              <div className="text-sm text-gray-500">
                顯示非匿名留言 ({sortedComments.length} 則)
              </div>
            </div>
            <p className="text-sm text-gray-500">
              註：匿名留言不會顯示在此列表中
            </p>
          </CardHeader>
          <CardContent className="overflow-auto h-[calc(100vh-200px)] p-0">
            {sortedComments.length > 0 ? (
              <div className="divide-y divide-gray-200/50">
                {sortedComments.map(comment => (
                  <div key={comment.id} className="p-4 hover:bg-white/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        {comment.url ? (
                          <a 
                            href={comment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {comment.name}
                          </a>
                        ) : (
                          <span className="font-medium">{comment.name}</span>
                        )}
                        <time className="text-sm text-gray-500">
                          {new Date(comment.timestamp).toLocaleString('zh-TW', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </time>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                目前沒有非匿名留言
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export { CommentList };