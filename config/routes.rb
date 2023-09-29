Rails.application.routes.draw do
  get 'sections/show'
  get 'courses/index'
  get 'courses/show'
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
  }
 

  root 'page#index'
  get 'admin/users', to: 'admin#users'
resources :entrollments
resources :courses do
  resources :entrollments
end

  resources :courses, only: [:index, :show]
  resources :courses do
    resources :sections
  end
  namespace :admin do
    resources :courses do
      resources :sections
    end
  end
  
  namespace :admin do
    resources :sections do
      resources :lessons
    end
  end
  namespace :admin do
    resources :entrollments, only: [:index, :edit, :update, :destroy, :show] do
      member do
        post :update_status
      end
    end
  end
  
end
