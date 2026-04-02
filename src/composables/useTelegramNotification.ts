import { telegramConfig } from '~/logic'

interface TelegramMessage {
  message: string
  bossName?: string
  battleResult?: 'win' | 'lose'
}

export async function sendTelegramNotification({ message, bossName, battleResult }: TelegramMessage) {
  const { botToken, chatId, enabled } = telegramConfig.value

  if (!enabled || !botToken || !chatId)
    return

  const lines = ['碧蓝幻想通知']

  if (battleResult === 'win')
    lines.push('结果: 胜利')
  else if (battleResult === 'lose')
    lines.push('结果: 失败')

  lines.push(message)

  if (bossName)
    lines.push(`Boss: ${bossName}`)

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
      }),
    })

    if (!response.ok)
      console.error('Telegram notification failed:', await response.text())
  }
  catch (error) {
    console.error('Failed to send Telegram notification:', error)
  }
}
