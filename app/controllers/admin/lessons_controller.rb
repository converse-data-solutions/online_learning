# frozen_string_literal: true

# This is an Admin Lesson controller
class Admin::LessonsController < ApplicationController
  before_action :set_lesson, only: %i[show edit update destroy]
  require 'will_paginate/array'

  def index # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
    if params[:section_id].present?
      @section = Section.find_by(id: params[:id])
      @lessons = @section.lessons.includes(clip_attachment: :blob, attachments_attachments: :blob)
      respond_to(&:js)
    else
      @lessons = []
      Lesson.includes(:section, clip_attachment: :blob, attachments_attachments: :blob).each do |lesson|
        @lessons.push(lesson)
      end
      @lessons = @lessons.paginate(page: params[:page], per_page: 5)
    end
  end

  def new
    @lesson = Lesson.new
    respond_to do |format|
      format.html # This will render the new.html.erb view
      format.turbo_stream # This will render the new.turbo_stream.erb view
    end
  end

  def create # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    @lesson = Lesson.new(lesson_params)
    byebug
    respond_to do |format|
      if @lesson.save
        @lessons = Lesson.where(section_id: @lesson.section_id)
        format.html
        format.turbo_stream
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append('course-table', partial: 'shared/failed', locals: { message: 'Lesson creation failed.', type: 'notice' })
          ]
        end
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit; end

  def update
    respond_to do |format|
      byebug
      if @lesson.update(lesson_params)
        @lessons = Lesson.where(section_id: @lesson.section_id)
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_lesson_url(@lesson) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update('steeper-edit-lesson-popup', partial: 'admin/lessons/edit', locals: { lesson: @lesson, section: @section }),
            turbo_stream.append('course-table', partial: 'shared/failed', locals: { message: 'Lesson update failed.', type: 'notice' })
          ]
        end
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @lesson&.destroy
        @lessons = Lesson.where(section_id: @lesson.section_id)
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace('lessonTable', partial: 'admin/lessons/table', locals: { lessons: @lessons }),
            turbo_stream.append('course-table', partial: 'shared/flash', locals: { message: 'Lesson was successfully destroyed.', type: 'notice' })
          ]
        end
        format.json { render :show, status: :ok, location: admin_lesson_url(@lesson) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append('course-table', partial: 'shared/failed', locals: { message: 'Lesson destroy failed.', type: 'notice' }),
            turbo_stream.replace('lessonTable', partial: 'admin/lessons/table', locals: { lessons: @lessons })
          ]
        end
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  def alter_lesson # rubocop:disable Metrics/MethodLength
    @lessons = Lesson.where(section_id: params[:section_id])
    @section = Section.find_by(id: params[:section_id])
    @section_id = @section.id
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.replace('lessonTable', partial: 'admin/lessons/table', locals: { section_id: @section_id }),
          turbo_stream.replace('lesson-admin-form', partial: 'admin/lessons/form', locals: { section_id: @section_id })
        ]
      end
    end
  end

  private

  def section_assignment
    @section = Section.find_by(id: params[:id])
  end

  def set_lesson
    @lesson = Lesson.find_by(id: params[:id])
  end

  def lesson_params
    params.require(:lesson).permit(:title, :description, :section_id, :clip, attachments: [])
  end
end
