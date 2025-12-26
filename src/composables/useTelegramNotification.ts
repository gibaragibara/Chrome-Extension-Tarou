import { telegramConfig } from '~/logic'

/**
 * Telegram 消息接口
 * @property {string} message - 通知消息内容
 * @property {string} [bossName] - Boss 名称（可选）
 * @property {'win' | 'lose'} [battleResult] - 战斗结果类型（可选）
 */
interface TelegramMessage {
    message: string
    bossName?: string
    battleResult?: 'win' | 'lose'
}

/**
 * 发送 Telegram 通知
 *
 * 此函数通过 Telegram Bot API 发送消息到指定用户
 * 仅在用户已配置并启用 Telegram 通知时才会发送
 *
 * @param {TelegramMessage} options - 消息配置对象
 * @param {string} options.message - 通知消息内容
 * @param {string} [options.bossName] - Boss 名称，将显示在通知中
 * @param {'win' | 'lose'} [options.battleResult] - 战斗结果类型，用于选择不同的展示样式
 *
 * @example
 * // 发送战斗胜利通知
 * sendTelegramNotification({
 *   message: '战斗结束',
 *   bossName: '巴哈姆特 HL',
 *   battleResult: 'win'
 * })
 *
 * @example
 * // 发送普通通知（无战斗结果）
 * sendTelegramNotification({
 *   message: '探险完成'
 * })
 */
export async function sendTelegramNotification(options: TelegramMessage) {
    const { message, bossName, battleResult } = options

    // 前置检查：确认 Telegram 配置已完成且功能已启用
    // 如果任一条件不满足，则静默返回，不发送通知
    if (!telegramConfig.value.botToken || !telegramConfig.value.chatId || !telegramConfig.value.enabled) {
        return
    }

    try {
        // 构建 Telegram Bot API 请求 URL
        // 格式：https://api.telegram.org/bot{token}/sendMessage
        const url = `https://api.telegram.org/bot${telegramConfig.value.botToken}/sendMessage`

        // 构建消息文本内容
        // 使用 Markdown 格式，支持加粗、斜体等样式
        let text = `🎮 *碧蓝幻想通知*\n\n`

        // 根据战斗结果类型选择不同的展示样式
        if (battleResult === 'win') {
            // 战斗胜利：显示绿色勾号
            text += `✅ ${message}\n`
            if (bossName) {
                text += `Boss: ${bossName}`
            }
        } else if (battleResult === 'lose') {
            // 战斗失败：显示红色叉号
            text += `❌ ${message}\n`
            if (bossName) {
                text += `Boss: ${bossName}`
            }
        } else {
            // 其他类型通知：仅显示消息内容
            text += message
        }

        // 发送 HTTP POST 请求到 Telegram API
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: telegramConfig.value.chatId,     // 接收者的 Chat ID
                text,                                     // 消息内容
                parse_mode: 'Markdown',                   // 使用 Markdown 解析模式
            }),
        })

        // 检查响应状态
        if (!response.ok) {
            const error = await response.json()
            console.error('Telegram notification failed:', error)
        }
    } catch (error) {
        // 捕获网络错误、API 错误等异常情况
        // 使用 console.error 记录错误，但不中断程序执行
        console.error('Failed to send Telegram notification:', error)
    }
}
