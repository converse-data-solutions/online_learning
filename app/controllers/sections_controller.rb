class SectionsController < ApplicationController
  def index
    @courses = Course.find(params[:course_id])
    @sections = @courses.sections
  end
  def show
    @course = Course.find(params[:course_id])
    @section = @course.sections.find(params[:id])
    @comments = @section.comments
    @comment = Comment.new
  end
end
