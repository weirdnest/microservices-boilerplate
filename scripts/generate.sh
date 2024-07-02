#!/bin/bash
echo $(pwd)

while getopts r:p: flag; do
  case "${flag}" in
  r) resource=${OPTARG} ;;
  p) project=${OPTARG} ;;
  esac
done

article="article"
articles="articles"
article_name="Article"
articles_name="Articles"
articles_module_path="libs/articles/src/articles.module.ts"
articles_entity_path="libs/articles/src/entities/article.entity.ts"
articles_abstract_entity_path="libs/articles/src/entities/article.ts"
articles_dto_create_path="libs/articles/src/dto/create-article.dto.ts"
articles_dto_update_path="libs/articles/src/dto/update-article.dto.ts"
articles_service_path="libs/articles/src/articles.service.ts"
articles_service_spec_path="libs/articles/src/articles.service.spec.ts"
articles_client_path="libs/articles/src/articles.client.ts"
articles_controller_rest_path="libs/articles/src/articles.controller.rest.ts"
articles_controller_rmq_path="libs/articles/src/articles.controller.rmq.ts"
articles_repo_path="libs/articles/src/repositories/articles.repo.ts"

articles_gateway_path="libs/articles/src/articles.gateway.ts"
articles_gateway_spec_path="libs/articles/src/articles.gateway.spec.ts"

articles_client_provider_path="libs/articles/src/providers/articles-client.provider.ts"
articles_repo_provider_path="libs/articles/src/providers/articles-repo.provider.ts"
articles_service_provider_path="libs/articles/src/providers/articles-service.provider.ts"
articles_repo_interface_path="libs/articles/src/interfaces/articles-repo.interface.ts"
articles_service_interface_path="libs/articles/src/interfaces/articles-service.interface.ts"
articles_constants_path="libs/articles/src/constants.ts"

entity=""
entities=""
entity_name=""
entities_name=""

module_path=""
entity_path=""
abstract_entity_path=""
dto_create_path=""
dto_update_path=""
repo_path=""
gateway_path=""
gateway_spec_path=""

service_path=""
service_spec_path=""
client_path=""

controller_path=""
controller_spec_path=""
controller_rest_path=""
controller_rmq_path=""

client_provider_path=""
repo_provider_path=""
service_provider_path=""
repo_interface_path=""
service_interface_path=""
constants_path=""
repos_path=""
providers_path=""
interfaces_path=""

output="./.output.module"

generate() {
  get_file_names
  get_entity_names
  update_files_content

  rm $output
}

get_file_names() {
  # module_output=$(nest g -d res $resource -p $project &>$output)
  nest g res $resource -p $project >$output
  module_path=$(cat $output | grep 'CREATE' | grep 'module.ts' | awk -F ' ' '{print $2}')
  dir="$(echo $module_path | awk -F "/$resource.module.ts" '{print $1}')"

  entity_path=$(cat $output | grep 'CREATE' | grep 'entity.ts' | awk -F ' ' '{print $2}')
  entity=$(echo $entity_path | awk -F '/' '{print $NF}' | awk -F '.entity.ts' {'print $1'})
  echo "entity: $entity, dir: $module_path"

  service_path=$(cat $output | grep 'CREATE' | grep "service.ts" | awk -F ' ' '{print $2}')
  service_spec_path=$(cat $output | grep 'CREATE' | grep "service.spec.ts" | awk -F ' ' '{print $2}')
  controller_path=$(cat $output | grep 'CREATE' | grep 'controller.ts' | awk -F ' ' '{print $2}')
  controller_spec_path=$(cat $output | grep 'CREATE' | grep 'controller.spec.ts' | awk -F ' ' '{print $2}')

  gateway_path="$(echo $controller_path | awk -F '.controller' '{print $1}').gateway.ts"
  gateway_spec_path="$(echo $controller_path | awk -F '.controller' '{print $1}').gateway.spec.ts"

  controller_rest_path="$(echo $controller_path | awk -F '.controller' '{print $1}').controller.rest.ts"
  controller_rmq_path="$(echo $controller_path | awk -F '.controller' '{print $1}').controller.rmq.ts"
  client_path="$(echo $service_path | awk -F '.service' '{print $1}').client.ts"

  entities=$(echo $service_path | awk -F '/' '{print $NF}' | awk -F '.service.ts' {'print $1'})
  abstract_entity_path="$dir/entities/$entity.ts"

  dto_create_path=$(cat $output | grep 'CREATE' | grep 'dto.ts' | grep 'create' | awk -F ' ' '{print $2}')
  dto_update_path=$(cat $output | grep 'CREATE' | grep 'dto.ts' | grep 'update' | awk -F ' ' '{print $2}')

  client_provider_path="$dir/$entities.client.ts"
  providers_path="$dir/providers"
  repos_path="$dir/repositories"
  repo_path="$dir/repositories/$entities-repo.ts"
  repo_provider_path="$providers_path/$entities-repo.provider.ts"
  service_provider_path="$providers_path/$entities-service.provider.ts"
  interfaces_path="$dir/interfaces"
  repo_interface_path="$interfaces_path/$entities-repo.interface.ts"
  service_interface_path="$interfaces_path/$entities-service.interface.ts"
  constants_path="$dir/constants.ts"
}

get_entity_names() {
  echo "entity_path: $entity_path, content: $(cat $entity_path)"
  entity_name=$(cat $entity_path | grep "export class" | awk -F ' ' '{print $3}')
  entities_name=$(cat $service_path | grep "export class" | grep "Service" | awk -F ' ' '{print $3}' | awk -F 'Service' '{print $1}')
  # entity_name="Company"
  # entities_name="Companies"
}

update_files_content() {
  echo "entity_name: $entity_name, entities_name: $entities_name"

  module_body=$(cat $articles_module_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$module_body" >$module_path

  entity_body=$(cat $articles_entity_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$entity_body" >$entity_path

  abstract_entity_body=$(cat $articles_abstract_entity_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$abstract_entity_body" >$abstract_entity_path

  dto_create_body=$(cat $articles_dto_create_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$dto_create_body" >$dto_create_path

  dto_update_body=$(cat $articles_dto_update_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$dto_update_body" >$dto_update_path

  service_body=$(cat $articles_service_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$service_body" >$service_path

  service_spec_body=$(cat $articles_service_spec_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$service_spec_body" >$service_spec_path

  client_body=$(cat $articles_client_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$client_body" >$client_path

  controller_rest_body=$(cat $articles_controller_rest_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$controller_rest_body" >$controller_rest_path

  controller_rmq_body=$(cat $articles_controller_rmq_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$controller_rmq_body" >$controller_rmq_path

  rm $controller_path
  rm $controller_spec_path

  gateway_body=$(cat $articles_gateway_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$gateway_body" >$gateway_path

  gateway_spec_body=$(cat $articles_gateway_spec_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$gateway_spec_body" >$gateway_spec_path

  mkdir $repos_path
  repo_body=$(cat $articles_repo_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$repo_body" >$repo_path

  mkdir $providers_path
  client_provider_body=$(cat $articles_client_provider_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$client_provider_body" >$client_provider_path

  service_provider_body=$(cat $articles_service_provider_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$service_provider_body" >$service_provider_path

  repo_provider_body=$(cat $articles_repo_provider_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$repo_provider_body" >$repo_provider_path

  mkdir $interfaces_path
  repo_interface_body=$(cat $articles_repo_interface_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$repo_interface_body" >$repo_interface_path

  service_interface_body=$(cat $articles_service_interface_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$service_interface_body" >$service_interface_path

  constants_body=$(cat $articles_constants_path | sed s/$articles_name/$entities_name/g | sed s/$article_name/$entity_name/g | sed s/$articles/$entities/g | sed s/$article/$entity/g)
  echo "$constants_body" >$constants_path

}

generate

echo "
entity=$entity
entities=$entities
entity_name=$entity_name
entities_name=$entities_name
module_path=$module_path
entity_path=$entity_path
abstract_entity_path=$abstract_entity_path
dto_create_path=$dto_create_path
dto_update_path=$dto_update_path
repo_path=$repo_path
service_path=$service_path
service_spec_path=$service_spec_path
client_path=$client_path
controller_path=$controller_path
controller_rest_path=$controller_rest_path
controller_rmq_path=$controller_rmq_path

client_provider_path=$client_provider_path
repo_provider_path=$repo_provider_path
service_provider_path=$service_provider_path
repo_interface_path=$repo_interface_path
service_interface_path=$service_interface_path
constants_path=$constants_path
"
