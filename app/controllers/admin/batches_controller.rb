class Admin::BatchesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_batch, only: %i[edit update destroy show]

  def index
    @batch = Batch.new
    @batch_timings = @batch.batch_timings.build
    @batches = Batch.includes(:course).paginate(page: params[:page], per_page: 10)
    respond_to do |format|
      format.html { render :index }
      format.turbo_stream
      format.json { render json: @batches }
    end
  end

  def create
    @batch = Batch.new(batch_params)    
    respond_to do |format|
      if @batch.save   
        @batches = Batch.paginate(page: params[:page], per_page: 10)
        format.turbo_stream
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace('batch-admin-form', partial: 'admin/batches/form', locals: { batch: @batch, batch_timings: @batch.batch_timings })
          ]
        end
        format.json { render json: @batch.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    respond_to do |format|
      format.turbo_stream
      format.json { render :show, status: :ok, location: admin_batch_url(@batch) }
    end
  end

  def edit
    render layout: false
    return if @batch

    flash[:alert] = 'Batch not found.'
    redirect_to admin_batches_path
  end

  def update
    respond_to do |format|
      if @batch.update(batch_params)
        @batches = Batch.paginate(page: params[:page], per_page: 10)
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_batch_url(@batch) }
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.update('edit-batch-popup', partial: 'admin/batches/edit',
                                                                        locals: { batch: @batch })
        end
        format.json { render json: @batch.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @batch.destroy
        @batches = Batch.includes(:course).paginate(page: params[:page], per_page: 10)
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update('batch-table', partial: 'admin/batches/table', locals: { batches: @batches }),
            turbo_stream.append('batch-table', partial: 'shared/flash',
                                               locals: { message: 'Batch deleted successfully.', type: 'notice' })
          ]
        end
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.append('batch-table', partial: 'shared/failed',
                                                                  locals: { message: 'Batch deletion failed.', type: 'notice' })
        end
      end
    end
  end

  private

  def set_batch
    @batch = Batch.find(params[:id])
  end

  def batch_params
    params.require(:batch).permit(:batch_name, :course_id, :effective_from, :effective_to, :primary_trainer_id,
                                  :secondary_trainer_id, batch_timings_attributes: [:id, :day, :from_time, :to_time, :_destroy], student_ids: [])
  end
end
