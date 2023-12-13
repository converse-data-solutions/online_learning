# frozen_string_literal: true
json.extract! profile, :id, :name, :gender, :age, :phno, :qualification, :user_id, :created_at, :updated_at # rubocop:disable Layout/EmptyLineAfterMagicComment
json.url profile_url(profile, format: :json)
