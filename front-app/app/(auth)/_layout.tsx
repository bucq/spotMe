import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false,
          title: 'ログイン'
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: false,
          title: '新規登録'
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: 'パスワードリセット',
          headerBackTitle: '戻る'
        }}
      />
    </Stack>
  );
}
