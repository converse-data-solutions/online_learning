class CoursesController < ApplicationController
  def index
    @courses = Course.all
    
  end

  def show
    @course = Course.find(params[:id])
    @sections = @course.sections
    @entrollment = Entrollment.new(user_id: current_user.id, course_id: @course.id)
    @comments = @course.comments
    @comment = Comment.new
  end
end
