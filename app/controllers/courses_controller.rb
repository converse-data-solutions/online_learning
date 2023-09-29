class CoursesController < ApplicationController
  def index
    @courses = Course.all
    
  end

  def show
    @course = Course.find(params[:id])
    @entrollment = Entrollment.new(user_id: current_user.id, course_id: @course.id)
    render "entrollments/new"
  end
end
