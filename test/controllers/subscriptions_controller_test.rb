require "test_helper"

class SubscriptionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @subscription = subscriptions(:one)
  end

  test "should get index" do
    get subscriptions_url
    assert_response :success
  end

  test "should get new" do
    get new_subscription_url
    assert_response :success
  end

  test "should create subscription" do
    assert_difference("Subscription.count") do
      post subscriptions_url, params: { subscription: { amount_paid: @subscription.amount_paid, next_due: @subscription.next_due, paid_at: @subscription.paid_at, status: @subscription.status, stripe_subscription_id: @subscription.stripe_subscription_id, subscription_type: @subscription.subscription_type, user_id: @subscription.user_id } }
    end

    assert_redirected_to subscription_url(Subscription.last)
  end

  test "should show subscription" do
    get subscription_url(@subscription)
    assert_response :success
  end

  test "should get edit" do
    get edit_subscription_url(@subscription)
    assert_response :success
  end

  test "should update subscription" do
    patch subscription_url(@subscription), params: { subscription: { amount_paid: @subscription.amount_paid, next_due: @subscription.next_due, paid_at: @subscription.paid_at, status: @subscription.status, stripe_subscription_id: @subscription.stripe_subscription_id, subscription_type: @subscription.subscription_type, user_id: @subscription.user_id } }
    assert_redirected_to subscription_url(@subscription)
  end

  test "should destroy subscription" do
    assert_difference("Subscription.count", -1) do
      delete subscription_url(@subscription)
    end

    assert_redirected_to subscriptions_url
  end
end
