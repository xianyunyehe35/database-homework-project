import request from "@/utils/request.js";

export const aliPay = (authorId) => {
  return request({
    url: `/alipay/pay/${authorId}`,
    method: "get",
  });
};

