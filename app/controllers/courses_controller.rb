# frozen_string_literal: true

# This is an course controller
class CoursesController < ApplicationController
  require 'stripe'
  def index
    @courses = Course.includes(:sections).all
  end

  def show
    @course = Course.find(params[:id])
    @sections = @course.sections
    @entrollment = Entrollment.new(user_id: current_user.id, course_id: @course.id)
    @comments = @course.comments
    @comment = Comment.new
  end
  def create_checkout_session
    @course_id = Course.find(params[:id])
    session = Stripe::Checkout::Session.create({
      metadata: {
        course_id: @course_id.id
      },
      customer_email: current_user.email,  
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'inr',
          unit_amount: @course_id.amount * 100,
          product_data: {
            name: "Purchase of " + @course_id.course_name
          }
        }
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/stripe/purchase_success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/'
    })
    redirect_to session.url, allow_other_host: true
  end

  def create_subscription_checkout_session

    if params[:monthly]
      plan = 'price_1O7zsNSAiOjRmAYnsGHXdfgZ' 
    else params[:yearly]
      plan = 'price_1O7zsNSAiOjRmAYntRb1O9us'
    end
    session = Stripe::Checkout::Session.create({
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
  byebug
  redirect_to session.url, allow_other_host: true, status: 303
  end

  def subscription_button
    @course = Course.find(params[:id])
  end
end
