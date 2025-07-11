type Modify<T, R> = Omit<T, keyof R> & R

type OmitPick<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type WithOptional<T, K extends keyof T> = OmitPick<T, K> & Partial<Pick<T, K>>
type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
	[Property in Key]-?: Type[Property]
}

type Primitive = string | number | symbol

type GenericObject = Record<Primitive, unknown>

type Join<
	L extends Primitive | undefined,
	R extends Primitive | undefined
> = L extends string | number
	? R extends string | number
		? `${L}.${R}`
		: L
	: R extends string | number
		? R
		: undefined

type Union<
	L extends unknown | undefined,
	R extends unknown | undefined
> = L extends undefined
	? R extends undefined
		? undefined
		: R
	: R extends undefined
		? L
		: L | R

/**
 * NestedPaths
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedPaths<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
type NestedPaths<
	T extends GenericObject,
	Prev extends Primitive | undefined = undefined,
	Path extends Primitive | undefined = undefined
> = {
	[K in keyof T]: T[K] extends GenericObject
		? NestedPaths<T[K], Union<Prev, Path>, Join<Path, K>>
		: Union<Union<Prev, Path>, Join<Path, K>>
}[keyof T]

/**
 * TypeFromPath
 * Get the type of the element specified by the path
 * @example
 * type TypeOfAB = TypeFromPath<{ a: { b: { c: string } }, 'a.b'>
 * // { c: string }
 */
type TypeFromPath<
	T extends GenericObject,
	Path extends string // Or, if you prefer, NestedPaths<T>
> = {
	[K in Path]: K extends keyof T
		? T[K]
		: K extends `${infer P}.${infer S}`
			? T[P] extends GenericObject
				? TypeFromPath<T[P], S>
				: never
			: never
}[Path]
