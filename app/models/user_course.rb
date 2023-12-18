# frozen_string_literal: true

class UserCourse < ApplicationRecord # rubocop:disable Style/Documentation
  belongs_to :user, optional: true
  belongs_to :course, optional: true
end
