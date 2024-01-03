# frozen_string_literal: true

# This is an Admin Section controller
class Admin::SectionsController < ApplicationController
  before_action :set_section, only: %i[show edit update]
  require 'will_paginate/array'

  def all
    @sections = Course.last.sections
  end

  def index # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    if params[:course_id].present?
      @course = Course.find(params[:course_id])
      @sections = @course.sections
      respond_to(&:js)
    else
      @sections = []
      @sections = Section.all.includes(:course)
      @sections = @sections.search_by_section_title(params[:search]).paginate(page: params[:page], per_page: 5)
    end
    respond_to do |format|
      format.html
      format.turbo_stream
      format.json { render json: @sections }
    end
  end

  def new
    @section = Sections.new
    respond_to do |format|
      format.html # This will render the new.html.erb view
      format.turbo_stream # This will render the new.turbo_stream.erb view
    end
  end

  def create # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    @section = Section.new(section_params)
    respond_to do |format|
      if @section.save
        @sections = @section.course.sections
        @section = Section.find_by(id: @section.id)
        format.html
        format.turbo_stream
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace('section-admin-form', partial: 'admin/sections/form', locals: { section: @section }),
            turbo_stream.replace('section-index-form', partial: 'admin/sections/sectionform', locals: { section: @section })
          ]
        end
        format.json { render json: @section.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit; end

  def update
    respond_to do |format|
      if @section.update(section_params)
        format.turbo_stream
      else
        format.turbo_stream { render turbo_stream: turbo_stream.update('steeper-edit-section-popup', partial: 'admin/sections/edit', locals: { section: @section }) }
        format.json { render json: @section.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @section = Section.find_by(id: params[:id])
    respond_to do |format|
      if @section&.destroy
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_section_url(@section) }
      else
        format.turbo_stream
        format.json { render json: @section.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def course_assignment
    @course = Course.find_by(id: params[:id])
  end

  def set_section
    @section = Section.find_by(id: params[:id])
  end

  def section_params
    params.require(:section).permit(:title, :description, :course_id)
  end
end
