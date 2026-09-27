# Paysages à vélo

La boutique e-commerce _Paysages à vélo_, propulsée par [Cecil](https://cecil.app) et [Stripe Checkout](https://stripe.com/fr/payments/checkout).

## Développement

```bash
curl -LO https://cecil.app/cecil.phar # download Cecil
composer install                      # install themes
php cecil.phar serve -v --open        # build, run local server and open browser
```

Pour tester le paiement en local, utiliser [Netlify CLI](https://docs.netlify.com/cli/get-started/) (qui sert aussi la fonction `checkout`) :

```bash
npm install
php cecil.phar build
STRIPE_SECRET_KEY=sk_test_… netlify dev --dir=_site
```

## Paiement

- Le panier est géré côté navigateur (`assets/js/main.js`, stockage local).
- Au clic sur « Commander », la fonction Netlify [`functions/checkout.js`](functions/checkout.js) recalcule les prix à partir de `/catalog.json` (généré par Cecil depuis les pages produits), calcule les frais de port (`functions/data/rates/`) puis crée une session [Stripe Checkout](https://docs.stripe.com/payments/checkout).
- La clé secrète Stripe est à définir dans la variable d’environnement Netlify `STRIPE_SECRET_KEY` (clé de test `sk_test_…` pour les prévisualisations).
- Les commandes sont consultables dans le [tableau de bord Stripe](https://dashboard.stripe.com/payments).

## Prévisualisation

Prévisualiser le site généré et publié sur [Netlify](https://www.netlify.com) :

- Branche : <https://github.com/cecillie/eshop/tree/preview>
- URL : <https://preview--bikeeshop.netlify.app>
