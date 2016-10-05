<div class="sr-ctn">
	<section id="sr-locator">
		<?php if( isset($group_name) ) : ?>
			<h1><?= $group_name; ?> Locator</h1>
		<?php else : ?>
			<h1>Rep Locator</h1>
		<?php endif; ?>
	</section><!-- #sr-locator -->

	<?php if( isset($group_id) ) : ?>
		<?php if( isset($color) ) : ?>
			<div id="sr-map" data-group-id="<?= $group_id; ?>" data-color="<?= $color; ?>">
		<?php else : ?>
			<div id="sr-map" data-group-id="<?= $group_id; ?>">
		<?php endif; ?>

		</div><!-- #sr-map -->
	<?php else : ?>
		<div id="sr-map"></div><!-- #sr-map -->
	<?php endif; ?>

	<section id="sr-reps-info"></section><!-- #sr-reps-info -->
</div><!-- .sr-ctn -->