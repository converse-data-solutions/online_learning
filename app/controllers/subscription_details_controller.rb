class SubscriptionDetailsController < ApplicationController
  before_action :set_subscription_detail, only: %i[ show edit update destroy ]

  # GET /subscription_details or /subscription_details.json
  def index
    @subscription_details = SubscriptionDetail.all
  end

  # GET /subscription_details/1 or /subscription_details/1.json
  def show
  end

  # GET /subscription_details/new
  def new
    @subscription_detail = SubscriptionDetail.new
  end

  # GET /subscription_details/1/edit
  def edit
  end

  # POST /subscription_details or /subscription_details.json
  def create
    @subscription_detail = SubscriptionDetail.new(subscription_detail_params)

    respond_to do |format|
      if @subscription_detail.save
        format.html { redirect_to subscription_detail_url(@subscription_detail), notice: "Subscription detail was successfully created." }
        format.json { render :show, status: :created, location: @subscription_detail }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @subscription_detail.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /subscription_details/1 or /subscription_details/1.json
  def update
    respond_to do |format|
      if @subscription_detail.update(subscription_detail_params)
        format.html { redirect_to subscription_detail_url(@subscription_detail), notice: "Subscription detail was successfully updated." }
        format.json { render :show, status: :ok, location: @subscription_detail }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @subscription_detail.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /subscription_details/1 or /subscription_details/1.json
  def destroy
    @subscription_detail.destroy

    respond_to do |format|
      format.html { redirect_to subscription_details_url, notice: "Subscription detail was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_subscription_detail
      @subscription_detail = SubscriptionDetail.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def subscription_detail_params
      params.require(:subscription_detail).permit(:user_id, :subscription_id, :stripe_subscription_id, :amount, :paid_at, :start_date, :end_date)
    end
end
