class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true
  belongs_to :user
  validates :body, presence: { message: "Comment body can't be blank" }
  validates_uniqueness_of :user_id, scope: :commentable_id , message: "You have already commented on this comment"
end
