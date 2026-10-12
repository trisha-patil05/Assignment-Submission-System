import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

export default function CommentSection({ submissionId }) {
  const user = getCurrentUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [submissionId]);

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/comments/submission/${submissionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.ok) {
        setComments(await res.json());
      }
    } catch (err) {
      console.error("❌ Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ submissionId, content: newComment })
      });

      if (res.ok) {
        setNewComment("");
        loadComments();
      }
    } catch (err) {
      console.error("❌ Error adding comment:", err);
      alert("Failed to add comment");
    }
  };

  const handleReply = async (commentId) => {
    if (!replyContent.trim()) {
      alert("Please enter a reply");
      return;
    }

    try {
      const res = await fetch(`/api/comments/${commentId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ content: replyContent })
      });

      if (res.ok) {
        setReplyContent("");
        setReplyingTo(null);
        loadComments();
      }
    } catch (err) {
      console.error("❌ Error replying:", err);
      alert("Failed to add reply");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.ok) {
        loadComments();
      }
    } catch (err) {
      console.error("❌ Error deleting comment:", err);
    }
  };

  if (loading) {
    return <div style={{ padding: "1rem", color: "#cbd5e1" }}>Loading comments...</div>;
  }

  return (
    <div style={{
      marginTop: "2rem",
      borderTop: "1px solid #334155",
      paddingTop: "2rem"
    }}>
      <h3 style={{ marginBottom: "1.5rem", color: "#f1f5f9" }}>
        💬 Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <form
        onSubmit={handleAddComment}
        style={{
          marginBottom: "2rem",
          background: "#1e293b",
          padding: "1rem",
          borderRadius: "8px"
        }}
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="form-textarea"
          rows="3"
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginTop: "0.5rem" }}
        >
          💬 Post Comment
        </button>
      </form>

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <p style={{ color: "#cbd5e1", textAlign: "center", padding: "2rem" }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                marginBottom: "1.5rem",
                background: "#1e293b",
                padding: "1rem",
                borderRadius: "8px",
                borderLeft: comment.isResolved ? "4px solid #10b981" : "4px solid #6366f1"
              }}
            >
              {/* Main Comment */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "0.5rem"
              }}>
                <div>
                  <p style={{
                    margin: "0 0 0.25rem 0",
                    color: "#f1f5f9",
                    fontWeight: "600"
                  }}>
                    {comment.authorId?.name || "Unknown"}
                    <span style={{
                      marginLeft: "0.5rem",
                      fontSize: "0.75rem",
                      color: "#6366f1",
                      background: "rgba(99,102,241,0.2)",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px"
                    }}>
                      {comment.authorRole}
                    </span>
                  </p>
                  <p style={{
                    margin: "0",
                    fontSize: "0.8rem",
                    color: "#94a3b8"
                  }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Delete Button */}
                {(user?.id === comment.authorId?._id || user?.role === "mentor") && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.75rem"
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>

              {/* Comment Content */}
              <p style={{
                margin: "0.5rem 0",
                color: "#f1f5f9",
                lineHeight: "1.6"
              }}>
                {comment.content}
              </p>

              {/* Resolved Badge */}
              {comment.isResolved && (
                <p style={{
                  margin: "0.5rem 0 0 0",
                  fontSize: "0.8rem",
                  color: "#10b981"
                }}>
                  ✅ Resolved
                </p>
              )}

              {/* Replies */}
              {comment.replies?.length > 0 && (
                <div style={{
                  marginTop: "1rem",
                  paddingLeft: "1rem",
                  borderLeft: "2px solid #334155"
                }}>
                  {comment.replies.map((reply, idx) => (
                    <div key={idx} style={{ marginBottom: "0.5rem" }}>
                      <p style={{
                        margin: "0 0 0.25rem 0",
                        fontSize: "0.85rem",
                        color: "#cbd5e1",
                        fontWeight: "600"
                      }}>
                        {reply.authorName}
                        <span style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.7rem",
                          color: "#10b981"
                        }}>
                          {reply.authorRole}
                        </span>
                      </p>
                      <p style={{
                        margin: "0",
                        fontSize: "0.8rem",
                        color: "#94a3b8"
                      }}>
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Button */}
              {replyingTo !== comment._id && (
                <button
                  onClick={() => setReplyingTo(comment._id)}
                  style={{
                    marginTop: "0.5rem",
                    background: "transparent",
                    color: "#6366f1",
                    border: "1px solid #6366f1",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.85rem"
                  }}
                >
                  🔁 Reply
                </button>
              )}

              {/* Reply Form */}
              {replyingTo === comment._id && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReply(comment._id);
                  }}
                  style={{
                    marginTop: "0.5rem",
                    paddingTop: "0.5rem",
                    borderTop: "1px solid #334155"
                  }}
                >
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      background: "#0f172a",
                      border: "1px solid #334155",
                      color: "#f1f5f9",
                      borderRadius: "4px",
                      fontFamily: "inherit",
                      fontSize: "0.9rem",
                      minHeight: "60px",
                      marginBottom: "0.5rem"
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                    >
                      Send Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                      style={{
                        background: "#475569",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.85rem"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}