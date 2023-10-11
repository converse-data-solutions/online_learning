# frozen_string_literal: true

# This is an Lesson controller
class LessonsController < ApplicationController
  def index
    @course = Course.find(params[:course_id])
    @section = @course.sections.find(params[:section_id])
    @lessons = @section.lessons
  end

  def show
    @lesson = Lesson.find(params[:id])
    @sections = Lesson.where(section_id: @lesson.section_id)
    @course = @lesson.section.course
    @entrollment = @course.entrollment.pluck(:id)
    @comments = @lesson.comments
    @comment = Comment.new
  end
end
