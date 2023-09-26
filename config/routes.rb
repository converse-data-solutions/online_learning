Rails.application.routes.draw do
  get 'sections/show'
  get 'courses/index'
  get 'courses/show'
  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }

  root 'page#index'
  get 'admin/users', to: 'admin#users'
  resources :courses, only: [:index, :show]
  resources :courses do
    resources :sections
  end
  namespace :admin do
    resources :courses do
      resources :sections
    end
  end
end
