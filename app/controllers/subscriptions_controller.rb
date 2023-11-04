class SubscriptionsController < ApplicationController
  before_action :set_subscription, only: %i[ show edit update ]
  # before_action :set_subscription, only: [:destroy]

require 'stripe'
  # GET /subscriptions or /subscriptions.json
  def index
    @subscriptions = Subscription.all
  end

  # GET /subscriptions/1 or /subscriptions/1.json
  def show
  end

  # GET /subscriptions/new
  def new
    @subscription = Subscription.new
  end

  # GET /subscriptions/1/edit
  def edit
  end

  # POST /subscriptions or /subscriptions.json
  def create
    @subscription = Subscription.new(subscription_params)

    respond_to do |format|
      if @subscription.save
        format.html { redirect_to subscription_url(@subscription), notice: "Subscription was successfully created." }
        format.json { render :show, status: :created, location: @subscription }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @subscription.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /subscriptions/1 or /subscriptions/1.json
  def update
    respond_to do |format|
      if @subscription.update(subscription_params)
        format.html { redirect_to subscription_url(@subscription), notice: "Subscription was successfully updated." }
        format.json { render :show, status: :ok, location: @subscription }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @subscription.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /subscriptions/1 or /subscriptions/1.json
  def destroy
    @subscription = Subscription.find(params[:id])
    Stripe::Subscription.cancel(@subscription.stripe_subscription_ref)
    byebug
    respond_to do |format|
      format.html { redirect_to subscriptions_url, notice: "Subscription was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def create_subscription_checkout_session

    if params[:monthly]
      plan = 'price_1O8f0bSAiOjRmAYnd1EoBr6H' 
    else params[:yearly]
      plan = 'price_1O8lwSSAiOjRmAYnIIfbweCj'
    end

    subscription = Subscription.find_or_create_by!(user: current_user) do |subscription|
      subscription.status = 'pending'
    end
    session = Stripe::Checkout::Session.create({
      client_reference_id: subscription.id,
     payment_method_types: ['card'],
     customer_email: current_user.email,
     success_url: 'http://localhost:3000/stripe/subscription_success?session_id={CHECKOUT_SESSION_ID}',
     cancel_url: 'http://localhost:3000/',
     mode: 'subscription',
     line_items: [{
       quantity: 1,
       price: plan
     }]
  })
  redirect_to session.url, allow_other_host: true, status: 303
  end

  def subscription_button
  end
  def cancel_subscription
    @subscription = current_user.subscription
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_subscription
      @subscription = Subscription.find(params[:id])
    end

    
    # Only allow a list of trusted parameters through.
    def subscription_params
      params.require(:subscription).permit(:paid_until, :stripe_customer_ref, :stripe_subscription_ref, :next_invoice_on, :user_id, :status)
    end
end
