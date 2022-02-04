export class NavigationConstant {

  //APP - ROUTING MODULE
  public static ROUTING_BASE_HREF = '/retail'
  public static ROUTING_ERROR_GENERAL = 'general-error';
  public static ROUTING_ERROR_CUSTOM = 'error';
  public static ROUTING_BO_DASHBOARD = 'dashboard';
  public static ROUTING_INVENTORY = 'inventory';
  public static ROUTING_CONFIGURATION = 'configuration';
  public static ROUTING_RETAIL = 'retail';
  public static ROUTING_MERCHANT = 'merchant';
  public static ROUTING_ORDER = 'order';
  public static ROUTING_TRANSACTION = 'transaction';
  public static ROUTING_INTERNAL = 'internal';
  public static ROUTING_INTERNAL_LIST = 'list';
  public static ROUTING_INTERNAL_DETAIL = 'detail';
  public static ROUTING_TERMS_CONDITION = 'agreement/terms-and-condition';
  public static ROUTING_MERCHANT_PRODUCT_NOT_FOUND = 'not-found';
  public static ROUTING_MERCHANT_NOT_FOUND = 'merchant-not-found';
  public static ROUTING_SIMULATOR_ORDER_RECEIVE = 'simulator/order/receive';
  public static ROUTING_MERCHANT_CART = 'cart';

  //Error from http status - general error
  public static ERROR_GENERAL = '/' + NavigationConstant.ROUTING_ERROR_GENERAL;

  //Error from code, http status 200 - custom error
  public static ERROR_CUSTOM = '/' + NavigationConstant.ROUTING_ERROR_CUSTOM;

  //Dashboard home
  public static DASHBOARD = '/' + NavigationConstant.ROUTING_BO_DASHBOARD;
  //Dashboard home
  public static INVENTORY_LIST = '/' + NavigationConstant.ROUTING_INVENTORY;
  public static ORDER = '/' + NavigationConstant.ROUTING_ORDER;

  public static TRANSACTION = '/' + NavigationConstant.ROUTING_TRANSACTION;

  public static ADD_PRODUCT = '/' + NavigationConstant.ROUTING_INVENTORY+'/add-product';


}
