import type { MenuItem, MenuItemId } from '../types/menu'

export const menuItems: readonly MenuItem[] = [
  // Breakfast
  { id: 'falafel', category: 'breakfast', price: 65, image: 'photo-1593001872095-7d5b3868fb1d', tags: ['popular', 'vegetarian'] },
  { id: 'shakshuka', category: 'breakfast', price: 120, image: 'photo-1590412200988-a436970781fa', tags: ['vegetarian', 'spicy'] },
  { id: 'hummusBeiruti', category: 'breakfast', price: 95, image: 'photo-1697126248475-a537cc5cce28', tags: ['vegetarian'] },
  { id: 'sahteinBreakfast', category: 'breakfast', price: 340, image: 'photo-1619941862585-cd4fa9a4c2cb', tags: ['popular'] },
  // Mains
  { id: 'koshari', category: 'mains', price: 85, image: 'photo-1775181180462-18b20da9340e', tags: ['popular', 'vegetarian'] },
  { id: 'warakEnab', category: 'mains', price: 150, image: 'photo-1759679134771-835a874351fe', tags: ['vegetarian'] },
  { id: 'lentilSoup', category: 'mains', price: 75, image: 'photo-1788536442471-902aa90a29d8', tags: ['vegetarian'] },
  { id: 'tagenLahma', category: 'mains', price: 290, image: 'photo-1710091691771-96b2e6d17dac', tags: [] },
  // Grills
  { id: 'shishTawook', category: 'grills', price: 240, image: 'photo-1594266063697-304befca9629', tags: ['popular'] },
  { id: 'kofta', category: 'grills', price: 260, image: 'photo-1763647818263-62a9256f097c', tags: ['spicy'] },
  { id: 'lambChops', category: 'grills', price: 420, image: 'photo-1692106914421-e04e1066bd62', tags: [] },
  { id: 'mixedGrill', category: 'grills', price: 690, image: 'photo-1771285119318-b342c3ecc51c', tags: ['popular'] },
  // Desserts
  { id: 'kunafa', category: 'desserts', price: 110, image: 'photo-1778447812923-88a9e3e6b567', tags: ['popular'] },
  { id: 'baklava', category: 'desserts', price: 95, image: 'photo-1676014959543-81df1079b423', tags: [] },
  { id: 'basbousa', category: 'desserts', price: 70, image: 'photo-1772469625117-412cb49042e6', tags: [] },
  { id: 'omAli', category: 'desserts', price: 90, image: 'photo-1515544645059-de313dd20a58', tags: [] },
  // Drinks
  { id: 'karkadeh', category: 'drinks', price: 45, image: 'photo-1563636680-28d36aeb83a4', tags: [] },
  { id: 'mintLemonade', category: 'drinks', price: 55, image: 'photo-1653542772393-71ffa417b1c4', tags: ['popular'] },
  { id: 'turkishCoffee', category: 'drinks', price: 50, image: 'photo-1566346289644-4e9c3dce657d', tags: [] },
  { id: 'asab', category: 'drinks', price: 60, image: 'photo-1555949366-819808d99159', tags: [] },
]

export const menuById: ReadonlyMap<MenuItemId, MenuItem> = new Map(menuItems.map((item) => [item.id, item]))
