class Lesson < ApplicationRecord
  belongs_to :section
  has_one_attached :clip
  has_many_attached :attachments
end
