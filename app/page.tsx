"use client"
import './home.css'
import { useState, useCallback } from 'react'

/* 
  表单错误提示，会出现两种情况
  1.必填校验，错误提示“请输入手机号”
  2.格式校验，需满足国内手机号规则，错误提示“手机号格式错误”
  举例：<p className="form-error">手机号格式错误</p> 
*/

/* getcode默认disabled=true，当mobile满足表单验证条件后才位false */

/* 
  表单错误提示，会出现两种情况
  1.必填校验，错误提示“请输入验证码”
  2.格式校验，6位数字，错误提示“验证码格式错误”
  举例：<p className="form-error">验证码格式错误</p> 
*/
/* 表单提交中，按钮内的文字会变成“submiting......” */

export default function Home() {
  const [formData, setFormData] = useState({
    mobile: '',
    code: ''
  })
  const [errors, setErrors] = useState({
    mobile: '',
    code: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)

  const validateMobile = useCallback((value: string) => {
    if (!value.trim()) return '请输入手机号'
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
    return ''
  }, [])

  const validateCode = useCallback((value: string) => {
    if (!value.trim()) return '请输入验证码'
    if (!/^\d{6}$/.test(value)) return '验证码格式错误'
    return ''
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    const validationFn = name === 'mobile' ? validateMobile : validateCode
    setErrors(prev => ({ ...prev, [name]: validationFn(value) }))
  }

  const handleGetCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsSendingCode(true)
    try {
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1500))
      // TODO: 这里添加发送验证码的接口调用
    } catch (error) {
      console.error('发送验证码失败:', error)
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // 提交前进行表单验证
    const mobileError = validateMobile(formData.mobile)
    const codeError = validateCode(formData.code)
    
    setErrors({
      mobile: mobileError,
      code: codeError
    })

    if (mobileError || codeError) return

    setIsSubmitting(true)
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('表单提交成功：', formData)
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-item">
        <input 
          placeholder="手机号" 
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
        />
        {errors.mobile && <p className="form-error">{errors.mobile}</p>}
      </div>

      <div className="form-item">
        <div className="input-group">
          <input 
            placeholder="验证码" 
            name="code"
            value={formData.code}
            onChange={handleInputChange}
          />
          <button 
            type="button"
            className="getcode" 
            disabled={!formData.mobile || !!errors.mobile || isSendingCode}
            onClick={handleGetCode}
          >
            {isSendingCode ? '发送中...' : '获取验证码'}
          </button>
        </div>
        {errors.code && <p className="form-error">{errors.code}</p>}
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={isSubmitting || isSendingCode}
      >
        {isSubmitting ? 'submiting......' : '登录'}
      </button>
    </form>
  );
}
