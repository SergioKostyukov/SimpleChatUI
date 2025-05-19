const AboutPage = () => (
  <div className="p-6 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-lg shadow-xl max-w-4xl mx-auto mt-8 sm:px-8">
    <h1 className="text-3xl font-extrabold text-indigo-700 mb-4">
      Про SimpleChat
    </h1>
    <p className="text-lg text-gray-700">
      Це простий веб-додаток для обміну повідомленнями між користувачами. SimpleChat дозволяє легко та швидко спілкуватися з друзями та колегами в зручному інтерфейсі.
    </p>
    <div className="mt-6 p-4 bg-indigo-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-indigo-600">Основні можливості:</h2>
      <ul className="list-disc pl-6 text-gray-600">
        <li>Простий інтерфейс для обміну повідомленнями</li>
        <li>Інтеграція з користувачами через реєстрацію та вхід</li>
        <li>Підтримка групових чатів</li>
        <li>Швидка доставка повідомлень у реальному часі</li>
      </ul>
    </div>
    <div className="mt-6 text-gray-600">
      <p>
        Додаток використовує сучасні технології, такі як ReactJS для клієнтської частини та NodeJS для серверної, що забезпечує швидкість та надійність.
      </p>
    </div>
  </div>
);

export default AboutPage;
