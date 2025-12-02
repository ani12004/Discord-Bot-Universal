export const animals = [
    { id: "dog", name: "Dog", emoji: "🐶", rarity: "Common", price: 50 },
    { id: "cat", name: "Cat", emoji: "🐱", rarity: "Common", price: 50 },
    { id: "mouse", name: "Mouse", emoji: "🐭", rarity: "Common", price: 40 },
    { id: "rabbit", name: "Rabbit", emoji: "🐰", rarity: "Common", price: 60 },
    { id: "fox", name: "Fox", emoji: "🦊", rarity: "Uncommon", price: 150 },
    { id: "bear", name: "Bear", emoji: "🐻", rarity: "Uncommon", price: 200 },
    { id: "panda", name: "Panda", emoji: "🐼", rarity: "Uncommon", price: 250 },
    { id: "tiger", name: "Tiger", emoji: "🐯", rarity: "Rare", price: 500 },
    { id: "lion", name: "Lion", emoji: "🦁", rarity: "Rare", price: 550 },
    { id: "dragon", name: "Dragon", emoji: "🐉", rarity: "Legendary", price: 2000 },
    { id: "unicorn", name: "Unicorn", emoji: "🦄", rarity: "Legendary", price: 2500 }
];

export const getAnimal = (id) => animals.find(a => a.id === id);
