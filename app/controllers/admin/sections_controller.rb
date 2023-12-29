# frozen_string_literal: true

# This is an Admin Section controller
class Admin::SectionsController < ApplicationController
  before_action :set_section, only: %i[show edit update]
  require 'will_paginate/array'

  def all
    @sections = Course.last.sections
  end

  def index
    if params[:course_id].present?
      @course = Course.find(params[:course_id])
      @sections = @course.sections
      respond_to(&:js)
    else
      @sections = []
      @sections = Section.all.includes(:course)
      
      @sections = @sections.paginate(page: params[:page], per_page: 5)
    end
  end

  def new
    @section = Sections.new
    respond_to do |format|
      format.html # This will render the new.html.erb view
      format.turbo_stream # This will render the new.turbo_stream.erb view
    end
  end

  def create
    @section = Section.new(section_params)
    respond_to do |format|
      if @section.save
        format.html { redirect_to admin_sections_path }
        format.turbo_stream
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace('section-admin-form', partial: 'admin/sections/form', locals: { section: @section }) }
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
    @section = Section.find(params[:id])
    @section.destroy
  end

  private

  def course_assignment
    @course = Course.find(params[:course_id])
  end

  def set_section
    @section = Section.find(params[:id])
  end

  def section_params
    params.require(:section).permit(:title, :description, :course_id)
  end
end
