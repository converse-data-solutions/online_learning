# frozen_string_literal: true

# This is an Admin Entrollments controller
class Admin::EntrollmentsController < ApplicationController
  before_action :check_admin_role
  before_action :set_entrollment, only: [:update_status]
  def index
    @entrollments = Entrollment.all
  end

  def update_status
    @entrollment = Entrollment.find(params[:entrollment_id])
    @entrollment.update(status: params[:status]) if params[:status].in?(Entrollment.statuses.keys)
    redirect_to admin_entrollments_path
  end

  private

  def set_entrollment
    @entrollment = Entrollment.find(params[:entrollment_id])
  end
end
