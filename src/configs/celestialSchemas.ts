// celestialSchemas.ts
import { z } from "zod";

// 再帰定義のため、まず空のスキーマを宣言
let nestedCelestialConfigSchema: z.ZodType<any>;

// 共通ベース
const baseCelestialSchema = z.object({
  name: z.string(),
  radius: z.number(),
  color: z.string(),
  textureUrl: z.string().optional(),
  rotationSpeed: z.number().optional(),
  tilt: z.number().optional(),
});

// 子要素付きベース（ここではまだ lazy を参照しない）
const baseWithChildren = baseCelestialSchema.extend({
  children: z.array(z.lazy(() => nestedCelestialConfigSchema)).optional(),
});

// 各種 celestial スキーマ（type による判別付き）
const starSchema = baseWithChildren.extend({
  type: z.literal("Star"),
});

const planetSchema = baseWithChildren.extend({
  type: z.literal("Planet"),
  orbitRadius: z.number(),
  orbitSpeed: z.number(),
  parent: z.string().optional(),
});

const moonSchema = baseWithChildren.extend({
  type: z.literal("Moon"),
  orbitRadius: z.number(),
  orbitSpeed: z.number(),
  parent: z.string().optional(),
});

// 再帰スキーマの本体をここで代入
nestedCelestialConfigSchema = z.discriminatedUnion("type", [
  starSchema,
  planetSchema,
  moonSchema,
]);

// 通常のフラット版も定義（従来の）
export const celestialConfigSchema = z.discriminatedUnion("type", [
  starSchema.omit({ children: true }),
  planetSchema.omit({ children: true }),
  moonSchema.omit({ children: true }),
]);

export const celestialConfigMapSchema = z.record(z.string(), celestialConfigSchema);

// 型定義
export type CelestialConfig = z.infer<typeof celestialConfigSchema>;
export type CelestialConfigMap = z.infer<typeof celestialConfigMapSchema>;
export type NestedCelestialConfig = z.infer<typeof nestedCelestialConfigSchema>;

// デフォルト補完関数
export function applyCelestialDefaults(config: CelestialConfig): CelestialConfig {
  return {
    ...config,
    rotationSpeed: config.rotationSpeed ?? 0.01,
    tilt: config.tilt ?? 0,
  };
}

// ネスト用のエクスポート
export { nestedCelestialConfigSchema };

export const nestedCelestialConfigListSchema = z.array(nestedCelestialConfigSchema);
