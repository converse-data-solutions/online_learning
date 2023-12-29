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
      Lesson.all.includes(:section, clip_attachment: :blob, attachments_attachments: :blob).each do |lesson|
        @lessons.push(lesson)
      end
      @lessons = @lessons.paginate(page: params[:page], per_page: 5)
    end
  end

  def new
    @lesson = Lesson.new
  end

  def create # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    @lesson = Lesson.new(lesson_params)

    respond_to do |format|
      if @lesson.save
        @lessons = Lesson.where(section_id: @lesson.section_id)

        format.html { redirect_to your_redirect_path, notice: 'Lesson was successfully created.' }
        format.turbo_stream { render turbo_stream: turbo_stream.replace('lessonTable', partial: 'admin/lessons/table', locals: { lessons: @lessons }) }
      else
        format.html { render partial: 'admin/lessons/form', locals: { lesson: @lesson }, status: :unprocessable_entity }
        format.turbo_stream { render turbo_stream: turbo_stream.replace('lesson-admin-form', partial: 'admin/lessons/form', locals: { section_id: @lesson.section_id, lesson: @lesson }) }
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit; end

  def update
    respond_to do |format|
      if @lesson.update(lesson_params)
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_lesson_url(@lesson) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.update('steeper-edit-lesson-popup', partial: 'admin/lessons/edit', locals: { lesson: @lesson, section: @section }) }
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @lesson.destroy
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_lesson_url(@lesson) }
      else
        format.turbo_stream
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  def alter_lesson # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    @lessons = Lesson.where(section_id: params[:section_id])
    @section = Section.find_by(id: params[:section_id])
    @section_id = @section.id
    puts "Request Format: #{request.format}"
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
