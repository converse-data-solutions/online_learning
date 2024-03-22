class Admin::BatchesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_batch, only: %i[edit update destroy show]

  def index
    @batches = Batch.all
    respond_to do |format|
      format.html { render :index }
      format.turbo_stream
      format.json { render json: @batches }
    end
  end

  def new
    @batch = Batch.new
  end

  def create
    @batch = Batch.new(batch_params)
    respond_to do |format|
      if @batch.save
        @batches = Batch.all
        format.turbo_stream
        # format.json { render :show, status: :created, location: admin_batch_url(@batch) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace('batch-admin-form', partial: 'admin/batches/form', locals: { batch: @batch })
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
  end

  def update
    respond_to do |format|
      if @batch.update(batch_params)
        @batches = Batch.all
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_batch_url(@batch) }
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace('edit-batch-popup', partial: 'admin/batches/edit',
                                                                        locals: { batch: @batch })
        end
        format.json { render json: @batch.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @batch.destroy
        @batches = Batch.all
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
    params.require(:batch).permit(:name, :description, :start_date, :end_date)
  end
end