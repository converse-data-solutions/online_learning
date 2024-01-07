# frozen_string_literal: true

# This is an course controller
class CoursesController < ApplicationController
  def index
    @courses = Course.includes(:sections).all
  end

  def show
    @course = Course.find_by(id: params[:id])
    @sections = @course.sections
    @entrollment = Entrollment.new(user_id: current_user.id, course_id: @course.id)
    @comments = @course.comments
    @comment = Comment.new
  end
end
