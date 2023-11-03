# frozen_string_literal: true

# Route File
Rails.application.routes.draw do
  resources :subscriptions
  get 'comments/create'
  get 'sections/show'
  get 'courses/index'
  get 'courses/show'
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  root 'page#index'

  post 'stripe_webhook', to: 'stripe#webhook'

  resources :users, only: [] do
    resources :profiles
  end
  resources :payments do
    member do
      get 'invoice'
    end
  end
  # get 'payments/invoice/:id', to: 'payments#invoice', as: :invoice
  resources :entrollments, only: %i[show create]
  # resources :courses do
  #   resources :entrollments
  # end
  resources :courses, only: %i[index show] do
    resources :comments, except: %i[index show]
  end

  resources :sections, only: [] do
    resources :comments, only: [:create]
  end

  resources :lessons, only: [] do
    resources :comments, only: [:create]
  end

  namespace :admin do
    resources :users, only: %i[index edit update create destroy new]
  end

  resources :courses, only: %i[index show]
  get 'stripe/purchase_success', to: 'stripe#purchase_success'
  get 'stripe/subscription_success', to: 'stripe#subscription_success'

  resources :courses, only: [] do
    resources :sections, only: %i[index show]
  end
  resources :courses, only: [] do
    resources :sections, only: [] do
      resources :lessons, only: %i[index show]
    end
  end

  resources :courses, only: [] do
    resources :ratings, only: [:create]
  end

  resources :sections, only: [] do
    resources :ratings, only: []
  end

  resources :lessons, only: [] do
    resources :ratings, only: []
  end

  namespace :admin do
    resources :payments
  end

  namespace :admin do
    resources :courses do
      resources :sections
    end
  end

  namespace :admin do
    resources :sections, only: [] do
      resources :lessons
    end
  end
  namespace :admin do
    resources :entrollments, only: %i[index] do
      member do
        post :update_status
      end
    end
  end

  namespace :admin do
    resources :entrollment_details, only: []
  end

  resources :lessons, only: %i[index show] do
    resources :entrollment_details, only: %i[show] do
    end
  end

  get 'entollment_details/update_progress', to: 'entrollment_details#update_progress', as: :update_progress

  resources :courses do
    member do
      post 'create-checkout-session', to: 'courses#create_checkout_session'
    end
  end

  post 'subscribe_button_create_subscription_checkout_session', to: 'subscriptions#create_subscription_checkout_session'
 

  get 'subscription_button', to: 'subscriptions#subscription_button', as: :subscription_button

end
