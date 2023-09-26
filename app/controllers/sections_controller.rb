class SectionsController < ApplicationController
  
  def index
    @courses = Course.find(params[:course_id])
    @sections = @courses.sections
  end
  def show
    @course = Course.find(params[:course_id])
    @section = @course.sections.find(params[:id])
  end
end
