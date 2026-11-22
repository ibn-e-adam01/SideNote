import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faPaperPlane,
  faCommentDots
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const CommentSection = ({
  getAllPostsData,
  Comments,
  setComments,
  isComment,
  setisComment,
  CmtPostId,
  setCmtPostId,
  User,
  setUser
}) => {
  const [Comment, setComment] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_B_API_URL;

  // Your existing API response structure:
  // res.data.Comments -> post object -> comments array
  const commentList = Comments?.[0]?.comments || [];

  const getComments = useCallback(async () => {
    if (!CmtPostId) return;

    try {
      setIsLoading(true);

      const res = await axios.get(
        `${API_URL}/getComments/${CmtPostId}`,
        { withCredentials: true }
      );

      if (res?.data?.Comments) {
        setComments([res.data.Comments]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [CmtPostId, setComments]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  const sendComment = async (e) => {
    e.preventDefault();

    const trimmedComment = Comment.trim();

    if (!trimmedComment || isSending) return;

    try {
      setIsSending(true);

      const res = await axios.post(
        `${API_URL}/createComment/${CmtPostId}`,
        { Comment: trimmedComment },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (res?.data) {
        setComment('');
        await getComments();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSending(false);
    }
  };

  const closeComments = () => {
    setisComment(false);
    setCmtPostId('');
    getAllPostsData();
  };

  const getInitials = (name = 'User') => {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('');
  };

  const formatTime = (date) => {
    if (!date) return '';

    const timestamp = new Date(date).getTime();

    if (Number.isNaN(timestamp)) return '';

    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return new Date(date).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!isComment) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeComments();
      }}
    >
      <div className="w-full max-w-xl h-[85vh] max-h-187.5 min-h-100 flex flex-col overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950 shadow-2xl">

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-200">
              <FontAwesomeIcon icon={faCommentDots} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-zinc-100">
                Comments
              </h2>
              <p className="text-xs text-zinc-500">
                {commentList.length}{' '}
                {commentList.length === 1 ? 'comment' : 'comments'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeComments}
            aria-label="Close comments"
            className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
        </div>

        {/* Comments list */}
        <div className="comments-scroll flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-5">

          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border-2 border-zinc-700 border-t-zinc-200 animate-spin" />
            </div>
          ) : commentList.length === 0 ? (
            <div className="h-full min-h-62.5 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 mb-4">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="text-2xl text-zinc-500"
                />
              </div>

              <h3 className="text-zinc-200 font-medium">
                No comments yet
              </h3>

              <p className="text-sm text-zinc-500 mt-1">
                Start the conversation.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {commentList.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-start gap-3"
                >
                  {/* Avatar */}
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 text-sm font-semibold text-zinc-200">
                    {getInitials(comment.authorName)}
                  </div>

                  {/* Comment content */}
                  <div className="flex-1 min-w-0">
                    <div className="inline-block max-w-full rounded-2xl rounded-tl-md bg-zinc-900 border border-zinc-800 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                        <h3 className={`text-sm font-semibold ${comment?.author === User[0]._id? 'text-orange-500' : ''}`}>
                          {comment.authorName || 'User'} {comment?.author === User[0]._id? '(You)' : ''}
                        </h3>

                        <span className="text-[11px] text-zinc-500">
                          {formatTime(
                            comment.commentedOn || comment.createdAt
                          )}
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap wrap-break-words">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment input */}
        <form
          onSubmit={sendComment}
          className="shrink-0 border-t border-zinc-800 bg-zinc-950 px-4 sm:px-5 py-4"
        >
          <div className="flex items-center gap-3 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 focus-within:border-zinc-500 transition-colors">
            <input
              type="text"
              value={Comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              maxLength={1000}
              className="flex-1 min-w-0 bg-transparent outline-none text-sm text-zinc-100 placeholder:text-zinc-500"
            />

            <button
              type="submit"
              disabled={!Comment.trim() || isSending}
              aria-label="Post comment"
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-950 hover:bg-white disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {isSending ? (
                <div className="w-4 h-4 rounded-full border-2 border-zinc-500 border-t-zinc-950 animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
              )}
            </button>
          </div>

          <p className="text-[10px] text-zinc-600 mt-2 ml-3">
            Keep it respectful.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;