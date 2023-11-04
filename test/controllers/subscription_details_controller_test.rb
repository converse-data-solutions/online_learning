require "test_helper"

class SubscriptionDetailsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @subscription_detail = subscription_details(:one)
  end

  test "should get index" do
    get subscription_details_url
    assert_response :success
  end

  test "should get new" do
    get new_subscription_detail_url
    assert_response :success
  end

  test "should create subscription_detail" do
    assert_difference("SubscriptionDetail.count") do
      post subscription_details_url, params: { subscription_detail: { amount: @subscription_detail.amount, end_date: @subscription_detail.end_date, paid_at: @subscription_detail.paid_at, start_date: @subscription_detail.start_date, stripe_subscription_id: @subscription_detail.stripe_subscription_id, subscription_id: @subscription_detail.subscription_id, user_id: @subscription_detail.user_id } }
    end

    assert_redirected_to subscription_detail_url(SubscriptionDetail.last)
  end

  test "should show subscription_detail" do
    get subscription_detail_url(@subscription_detail)
    assert_response :success
  end

  test "should get edit" do
    get edit_subscription_detail_url(@subscription_detail)
    assert_response :success
  end

  test "should update subscription_detail" do
    patch subscription_detail_url(@subscription_detail), params: { subscription_detail: { amount: @subscription_detail.amount, end_date: @subscription_detail.end_date, paid_at: @subscription_detail.paid_at, start_date: @subscription_detail.start_date, stripe_subscription_id: @subscription_detail.stripe_subscription_id, subscription_id: @subscription_detail.subscription_id, user_id: @subscription_detail.user_id } }
    assert_redirected_to subscription_detail_url(@subscription_detail)
  end

  test "should destroy subscription_detail" do
    assert_difference("SubscriptionDetail.count", -1) do
      delete subscription_detail_url(@subscription_detail)
    end

    assert_redirected_to subscription_details_url
  end
end
