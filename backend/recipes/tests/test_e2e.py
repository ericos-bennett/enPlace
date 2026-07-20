"""
E2E tests for the consolidated `recipes` lambda, run against the real
Terraform-deployed infra (API Gateway + lambda + DynamoDB) inside a
LocalStack container. See infra/local/e2e_test.sh for the harness that
starts LocalStack, deploys the infra, and invokes this suite.

These tests exercise every route that used to be its own lambda
(get_recipe, get_recipes, delete_recipe, create_recipe) to confirm that
the single consolidated lambda still dispatches each one correctly.
"""
import requests

from conftest import USER_ID, OTHER_USER_ID, make_token


def test_get_recipe_returns_existing_recipe(base_url, seed_data):
    resp = requests.get(f"{base_url}/recipes/e2e-get-recipe")
    assert resp.status_code == 200
    assert resp.json()["name"] == "Gettable Recipe"


def test_get_recipe_returns_404_for_missing_recipe(base_url, seed_data):
    resp = requests.get(f"{base_url}/recipes/does-not-exist")
    assert resp.status_code == 404


def test_get_recipes_lists_only_own_non_deleted_recipes(base_url, seed_data):
    resp = requests.get(
        f"{base_url}/recipes",
        headers={"Authorization": make_token(USER_ID)},
    )
    assert resp.status_code == 200

    ids = {item["Id"] for item in resp.json()}
    assert "e2e-get-recipe" in ids
    assert "e2e-delete-me" in ids
    assert "e2e-soft-deleted" not in ids
    assert "e2e-other-user-recipe" not in ids


def test_create_recipe_rejects_invalid_url(base_url):
    resp = requests.post(
        f"{base_url}/recipes",
        headers={"Authorization": make_token(USER_ID)},
        json={"recipeUrl": "not-a-url"},
    )
    assert resp.status_code == 400


def test_delete_recipe_returns_403_for_non_owner(base_url, seed_data):
    resp = requests.delete(
        f"{base_url}/recipes/e2e-delete-me",
        headers={"Authorization": make_token(OTHER_USER_ID)},
    )
    assert resp.status_code == 403


def test_delete_recipe_returns_404_for_missing_recipe(base_url):
    resp = requests.delete(
        f"{base_url}/recipes/does-not-exist",
        headers={"Authorization": make_token(USER_ID)},
    )
    assert resp.status_code == 404


def test_delete_recipe_soft_deletes_and_excludes_from_list(base_url, seed_data, table):
    resp = requests.delete(
        f"{base_url}/recipes/e2e-delete-me",
        headers={"Authorization": make_token(USER_ID)},
    )
    assert resp.status_code == 200

    list_resp = requests.get(
        f"{base_url}/recipes",
        headers={"Authorization": make_token(USER_ID)},
    )
    ids = {item["Id"] for item in list_resp.json()}
    assert "e2e-delete-me" not in ids

    item = table.get_item(Key={"Id": "e2e-delete-me"})["Item"]
    assert "DeletedAt" in item


def test_options_recipes_cors_preflight(base_url):
    resp = requests.options(f"{base_url}/recipes")
    assert resp.status_code == 200
    assert resp.headers.get("Access-Control-Allow-Methods") == "GET,POST,DELETE,OPTIONS"
