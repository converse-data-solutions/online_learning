# frozen_string_literal: true

# This is an Lesson controller
class LessonsController < ApplicationController
  def index
    @course = Course.find(params[:course_id])
    @section = @course.sections.find(params[:section_id])
    @lessons = @section.lessons.includes(clip_attachment: :blob, attachments_attachments: :blob)
  end

  def show
    @lesson = Lesson.find_by(id: params[:id])
    @sections = Lesson.where(section_id: @lesson.section_id)
    @course = @lesson.section.course
    @entrollment = @course.entrollment.pluck(:id)
    @comments = @lesson.comments
    @comment = Comment.new

    respond_to do |format|
      format.html
      format.turbo_stream { render :show, locals: { lesson: @lesson } }
    end
  end
end
