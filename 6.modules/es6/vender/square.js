console.log('加载了 square 模块')
import { multiply } from "./multiply.js"

export default function square (num) {
  return multiply(num, num)
}